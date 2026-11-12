<?php

namespace App\Providers;

use App\Models\Difficulty;
use App\Models\GameMode;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\View as ViewInstance;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }
        View::composer(
            ['minefield.login', 'minefield.admin-login', 'minefield.modes', 'minefield.game', 'minefield.shop', 'minefield.admin'],
            function (ViewInstance $view): void {
                static $options = null;
                if ($options === null || count($options['modes']) === 0) {
                    $options = [
                        'modes' => GameMode::query()->orderBy('id')->get()->map(
                            static function (GameMode $mode): array {
                                $modeLabels = [
                                    'classic' => ['label' => 'Cổ điển', 'hint' => 'Tất cả 8 ô xung quanh'],
                                    'plus' => ['label' => 'Dấu cộng', 'hint' => '4 ô kề cạnh (ngang & dọc)'],
                                    'corner' => ['label' => 'Góc chéo', 'hint' => '4 ô góc chéo'],
                                ];
                                $meta = $modeLabels[$mode->code] ?? null;
                                return [
                                    'id' => $mode->code,
                                    'label' => $meta ? $meta['label'] : $mode->name,
                                    'hint' => $meta ? $meta['hint'] : ($mode->description ?? $mode->name),
                                    'offsets' => $mode->neighbor_offsets,
                                ];
                            }
                        )->values(),
                        'difficulties' => Difficulty::query()->orderBy('id')->get()->map(
                            static function (Difficulty $difficulty): array {
                                $diffLabels = [
                                    'easy' => 'Dễ',
                                    'medium' => 'Trung bình',
                                    'hard' => 'Khó',
                                ];
                                return [
                                    'id' => $difficulty->code,
                                    'label' => $diffLabels[$difficulty->code] ?? $difficulty->name,
                                    'rows' => $difficulty->board_rows,
                                    'cols' => $difficulty->board_cols,
                                    'mines' => $difficulty->mine_count,
                                ];
                            }
                        )->values(),
                    ];
                }
                $view->with('minefieldGameOptions', $options);
            }
        );
    }
}
