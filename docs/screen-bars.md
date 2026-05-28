# 画面バー別機能詳細

このドキュメントは、`IL Designer Studio` の画面を構成する操作バーとパネルごとに、提供している機能を説明する。対象は現在の `index.html` と `app.js` の実装である。

## 対象範囲

画面上の主要な操作領域は次の通りである。

- メニューバー: 画面最上部の `menu-bar`
- オプションバー: ツール設定を並べる `options-bar`
- 左ツールバー: ツール選択を行う `toolbar`
- キャンバス周辺バー: ルーラー、キャンバス、ステータスバー
- 右ドック: `dock` 内の各パネル

メニュー項目とパネルボタンは、多くが `data-command` またはボタン ID を通じて `app.js` の関数へ接続される。表示状態、ボタンの有効・無効、アクティブ表示は `updateToolUi()`、`updateActionStates()`、`syncControlsFromState()` で更新される。

## メニューバー

メニューバーはブランド表示、アプリケーションメニュー、ファイル操作のショートボタンで構成される。

### ブランド領域

左端に `IL` のブランドマーク、アプリ名、現在のファイル名を表示する。ファイル名は `fileMeta` に反映され、初期値は `Untitled.psd` である。画像を開いた場合やドキュメント状態が更新された場合、`updateMeta()` によってドキュメント名とサイズ情報が更新される。

### File メニュー

File メニューはドキュメント入出力を扱う。

| 項目 | 機能 |
| --- | --- |
| New... | 新規ドキュメントを作成する。サイズ入力後、初期レイヤーと履歴を作り直す。 |
| Open... | 画像ファイル選択を開き、読み込んだ画像を新しいドキュメントとして配置する。 |
| Place Embedded... | 画像ファイルを現在のドキュメントに新規レイヤーとして配置する。 |
| Export PNG | 現在の合成結果を PNG として書き出す。 |
| Export JPEG | 現在の合成結果を JPEG として書き出す。 |
| Revert | 初期スナップショットへ戻す。 |

上部右側の `Open`、`PNG`、`JPEG` ボタンは、この File メニューの主要操作を常時表示したショートカットである。

### Edit メニュー

Edit メニューは履歴、クリップボード、選択範囲へのピクセル編集を扱う。

| 項目 | 機能 |
| --- | --- |
| Undo / Step Backward | 履歴を 1 つ前へ戻す。 |
| Redo / Step Forward | 履歴を 1 つ先へ進める。 |
| Cut | 選択範囲またはアクティブレイヤーのピクセルをコピーし、元を削除する。 |
| Copy | 選択範囲またはアクティブレイヤーのピクセルをコピーする。 |
| Copy Merged | 表示レイヤーの合成結果からコピーする。 |
| Paste | クリップボード内容を新規レイヤーとして貼り付ける。 |
| Paste Into | 選択範囲内へ貼り付ける。 |
| Delete | 選択範囲または対象ピクセルを削除する。 |
| Fill... | 前景色、背景色、指定色などで塗りつぶすための入力を開く。 |
| Content-Aware Fill... | 選択範囲周辺の色を推定して塗りつぶす。 |
| Stroke... | 選択範囲の境界線を描画する。 |
| Fill Foreground / Fill Background | 前景色または背景色で即時塗りつぶす。 |

選択範囲がない場合は、操作によってアクティブレイヤー全体または対象外として扱われる。レイヤーロックや調整レイヤーでは一部操作が無効になる。

### Image メニュー

Image メニューはキャンバス全体または画像補正を扱う。

| 分類 | 項目 | 機能 |
| --- | --- | --- |
| サイズ | Image Size... | ドキュメントと全レイヤーを指定サイズへリサイズする。 |
| サイズ | Canvas Size... | キャンバスサイズを変更し、レイヤー位置を調整する。 |
| 補正 | Levels... / Curves... | レベル補正、トーンカーブを適用する。 |
| 補正 | Hue/Saturation... / Vibrance... / Color Balance... | 色相、彩度、自然な彩度、カラーバランスを調整する。 |
| 補正 | Black & White... / Exposure... / Shadows/Highlights... | 白黒化、露光量、シャドウ・ハイライトを適用する。 |
| 自動補正 | Auto Tone / Auto Color / Auto Contrast | ピクセル分布をもとに自動補正する。 |
| 変換 | Invert / Desaturate / Threshold... / Posterize... | 階調反転、彩度低下、二値化、ポスタリゼーションを適用する。 |
| キャンバス | Trim Transparent Pixels / Reveal All | 透明領域のトリム、全レイヤー領域を含むキャンバス拡張を行う。 |
| 回転・反転 | Rotate / Flip Canvas | キャンバスとレイヤー、選択範囲、ガイドをまとめて変換する。 |
| その他 | Reset Adjustments / Apply Visible Filters | 補正値のリセット、表示フィルターの焼き込みを行う。 |
| レイヤー | New Adjustment Layer | 調整レイヤーを追加する。 |
| ツール | Crop / Free Transform | 切り抜きツールまたは自由変形モードに入る。 |

### Filter メニュー

Filter メニューはアクティブレイヤーまたはマスクに対する破壊的フィルターを実行する。選択範囲がある場合は、選択マスクで対象領域が限定される。

| 分類 | 項目 |
| --- | --- |
| ぼかし | Gaussian Blur、Box Blur、Average、Surface Blur、Smart Blur、Radial Blur、Motion Blur |
| ゆがみ・座標変換 | Twirl、Pinch、Ripple、Spherize、ZigZag、Wave、Polar Coordinates、Shear、Offset |
| シャープ・輪郭 | Sharpen、Unsharp Mask、Smart Sharpen、High Pass、Find Edges、Glowing Edges |
| 表現効果 | Oil Paint、Emboss、Diffuse、Wind、Trace Contour、Extrude、Tiles、Solarize |
| 生成・光 | Clouds、Difference Clouds、Lens Flare、Fibers、Lighting Effects |
| ノイズ | Add Noise、Reduce Noise、Despeckle、Dust & Scratches、Median |
| ピクセル化 | Color Halftone、Crystallize、Pointillize、Fragment、Facet、Mezzotint、Mosaic |
| 明暗範囲 | Maximum、Minimum |

フィルター系ボタンは、アクティブレイヤーが調整レイヤーの場合やピクセル編集がロックされている場合に無効化される。

### Layer メニュー

Layer メニューはレイヤーの生成、並び替え、マスク、スタイル、結合をまとめて扱う。

| 分類 | 項目 | 機能 |
| --- | --- | --- |
| 作成 | New Layer / New Adjustment Layer | 通常レイヤーまたは調整レイヤーを追加する。 |
| 複製 | Layer Via Copy / Layer Via Cut / Duplicate Layer | 選択範囲またはレイヤーを複製する。Cut は元ピクセルを削除する。 |
| 管理 | Rename Layer / Delete Layer | レイヤー名変更、削除を行う。 |
| 背景 | Layer from Background / Background from Layer | 背景レイヤーと通常レイヤーを変換する。 |
| 変形 | Rotate Layer / Flip Layer | アクティブレイヤーのみを回転・反転する。 |
| 整列 | Align Left / Center / Right / Top / Middle / Bottom | 選択範囲またはキャンバスを基準に整列する。 |
| 順序 | Bring Forward / Send Backward など | レイヤーの重なり順を変更する。 |
| 選択 | Select Layer Above / Below など | アクティブレイヤーを上下へ移動選択する。 |
| 制約 | Create Clipping Mask | 下のレイヤーの不透明領域にクリップする。 |
| ロック | Lock Transparent Pixels / Pixels / Position / All | 透明ピクセル、ピクセル編集、位置編集を制限する。 |
| マスク | Add / Disable / Apply / Invert / Delete Layer Mask | レイヤーマスクを操作する。 |
| スタイル | Drop Shadow / Stroke / Outer Glow など | レイヤースタイルの切り替え、コピー、貼り付け、削除、ラスタライズを行う。 |
| 結合 | Merge Down / Stamp Visible / Merge Visible / Flatten Image | レイヤーの合成や画像統合を行う。 |

背景レイヤーでは不透明度、描画モード、削除、位置変更などの一部操作が制限される。

### Select メニュー

Select メニューは選択範囲の作成、復元、加工を扱う。

| 項目 | 機能 |
| --- | --- |
| All | キャンバス全体を選択する。 |
| Deselect | 現在の選択範囲を解除する。 |
| Reselect | 直前の選択範囲を復元する。 |
| Inverse | 選択範囲を反転する。 |
| Quick Mask | クイックマスク編集モードを切り替える。 |
| Subject | アクティブレイヤーの不透明領域から被写体相当の選択範囲を作る。 |
| Color Range... | 色域を指定して選択する。 |
| Similar / Grow | 類似色選択、選択範囲の拡張を行う。 |
| Save Selection / Load Alpha Channel | 選択範囲をアルファチャンネルとして保存・読み込みする。 |
| Feather / Smooth / Expand / Contract / Border | 選択範囲のぼかし、平滑化、拡張、縮小、境界化を行う。 |

選択範囲が必要な操作は、選択がないとパネル側で無効化される。

### View メニュー

View メニューは表示倍率、補助表示、ワークスペース表示を扱う。

| 項目 | 機能 |
| --- | --- |
| Actual Pixels | 100% 表示にする。 |
| Fit on Screen | キャンバスを画面に収める。 |
| Zoom In / Zoom Out | 表示倍率を増減する。 |
| Show Rulers | 上・左ルーラーの表示を切り替える。 |
| Show Extras | 選択範囲、ガイド、オーバーレイ類の表示を切り替える。 |
| Show Grid / Show Guides | グリッドまたはガイドの表示を切り替える。 |
| Snap / Snap to Grid / Snap to Guides | スナップ全体、グリッド吸着、ガイド吸着を切り替える。 |
| Toggle Panels | 右ドックだけを表示・非表示にする。 |
| Toggle Tools and Panels | メニュー、オプション、ツール、パネルをまとめて非表示にする。 |
| New Vertical Guide / New Horizontal Guide | 縦または横ガイドを追加する。 |
| Clear Guides | すべてのガイドを削除する。 |

## オプションバー

オプションバーは、現在選択されているツールの主要設定と、頻繁に使う共通操作を横並びで提供する。常にすべての項目が表示されるが、実際に参照される項目はツールによって異なる。

### ツール表示

左端の `activeToolName` と `activeToolKey` に、現在のツール名とショートカットキーを表示する。表示内容は `toolInfo` と `updateToolUi()` によって同期される。

### 移動・選択系設定

| UI | 対象ツール | 機能 |
| --- | --- | --- |
| Auto-Select | Move | クリック位置の最前面レイヤーを自動選択する。 |
| Tolerance | Magic Wand / Color Range | 色差の許容値を指定する。 |
| Selection | Marquee / Lasso / Magic Wand など | 新規、追加、削除、共通部分の選択モードを切り替える。 |
| Contiguous | Magic Wand | 隣接ピクセルだけを対象にするか、全体から近い色を拾うかを切り替える。 |
| Sample All | Magic Wand | アクティブレイヤーだけでなく合成結果からサンプリングする。 |

### ブラシ・修復系設定

| UI | 対象ツール | 機能 |
| --- | --- | --- |
| Brush | Brush、Eraser、Clone、Heal、Smudge、Tone など | ブラシサイズを指定する。 |
| Opacity | Brush、Eraser、Clone など | 描画の不透明度を指定する。 |
| Heal | Spot Healing Brush | 修復結果と元画像の混合強度を指定する。 |
| Strength | Smudge | にじませる強さを指定する。 |
| Mode | Dodge/Burn | 覆い焼きと焼き込みを切り替える。 |
| Exposure | Dodge/Burn | 明るくする、または暗くする強さを指定する。 |

### グラデーション・図形・文字設定

| UI | 対象ツール | 機能 |
| --- | --- | --- |
| Gradient | Gradient | 線形または円形グラデーションを選ぶ。 |
| Reverse | Gradient | 前景色と背景色の向きを反転する。 |
| Shape | Shape | 長方形または楕円を選ぶ。 |
| Fill | Shape | 図形の塗り色を指定する。 |
| Stroke | Shape | 図形の線を有効化し、線色を指定する。 |
| W | Shape | 線幅を指定する。 |
| Text | Type | 配置する文字列を入力する。 |
| Size | Type | 文字サイズを指定する。 |

### モーダル操作ボタン

| ボタン | 機能 |
| --- | --- |
| Apply Crop | 切り抜き矩形を確定する。Crop ツールで矩形がある場合のみ有効。 |
| Cancel | 切り抜きまたは自由変形などのモーダル操作を中止する。 |
| Clear Selection | 選択範囲を解除する。 |

### 共通ショートボタン

右側には、Undo、Redo、Copy、Paste、Fit、Reset が並ぶ。履歴がない場合の Undo/Redo、クリップボードが空の場合の Paste などは `updateActionStates()` で無効化される。

## 左ツールバー

左ツールバーは編集ツールを切り替える縦並びのバーである。クリックまたはキーボードショートカットで `state.activeTool` が変わり、`updateToolUi()` によりアクティブ表示とオプションバーのツール名が更新される。

| 表示 | ツール | 主な機能 |
| --- | --- | --- |
| V Move | Move Tool | レイヤー移動、自動選択、Shift ドラッグによる水平・垂直拘束、Alt ドラッグによる複製、矢印キー移動。 |
| M Select | Rectangular Marquee | 矩形選択範囲を作成する。選択モードで追加・削除・交差に対応する。 |
| W Wand | Magic Wand | クリックした色に近い領域を選択する。許容値、隣接、全レイヤーサンプルを参照する。 |
| L Lasso | Lasso Tool | 自由線で囲った範囲を選択する。 |
| P Pen | Pen Tool | アンカーポイントを追加して作業パスを作成する。 |
| C Crop | Crop Tool | 切り抜き矩形を作成し、オプションバーの Apply Crop で確定する。 |
| B Brush | Brush Tool | 前景色でピクセルまたはマスクへ描画する。Shift クリックで直線描画、Alt で色取得。 |
| E Erase | Eraser Tool | 対象ピクセルを透明化する。マスク編集中はマスクを編集する。 |
| J Heal | Spot Healing Brush | 周辺サンプルをもとにクリック・ドラッグ位置を修復する。 |
| S Stamp | Clone Stamp | Alt で取得した複製元から描画する。 |
| Y Hist | History Brush | 履歴スナップショットをソースとして描き戻す。 |
| G Grad | Gradient Tool | 前景色と背景色で線形または円形グラデーションを描画する。 |
| U Shape | Shape Tool | 長方形または楕円の図形レイヤーを作成する。 |
| R Smudge | Smudge Tool | ドラッグ方向へピクセルをにじませる。 |
| O Tone | Dodge/Burn Tool | 覆い焼きまたは焼き込みで明暗を編集する。 |
| T Type | Type Tool | クリック位置に文字レイヤーを作成する。 |
| I Pick | Eyedropper Tool | キャンバス上の色を前景色へ取得する。Alt では背景色へ取得する。 |
| H Hand | Hand Tool | 表示位置をドラッグで移動する。Space キーで一時的にも使用できる。 |
| Z Zoom | Zoom Tool | クリックまたはドラッグ範囲でズームする。 |

下部の前景色・背景色チップは、ツールバー内で直接色を変更するための入力である。Color パネルの FG/BG と同期される。

## キャンバス周辺バー

中央の `document-area` は、ルーラー、キャンバス、ステータスバーで構成される。

### ルーラー

上部ルーラーと左ルーラーは、現在の表示倍率とパン位置に応じて目盛りを描画する。ルーラーからドラッグすると、縦または横ガイドを追加できる。View メニューの Show Rulers で表示を切り替えられる。

### キャンバス領域

`canvas-shell` 内の `editorCanvas` が編集対象の表示領域である。ポインター操作は `beginPointer()`、`movePointer()`、`endPointer()` で処理され、アクティブツールに応じて選択、描画、移動、変形、ズームなどへ分岐する。

キャンバス上には必要に応じて次の補助表示が重なる。

- 選択範囲の境界
- クイックマスク
- 作業パス
- グリッド
- ガイド
- アクティブレイヤーのアウトライン
- ブラシカーソル
- 切り抜き矩形
- 自由変形ハンドル
- 複製元マーカー

### ステータスバー

ステータスバーはキャンバス下部にあり、次の情報を表示する。

| 表示 | 内容 |
| --- | --- |
| `zoomStatus` | 現在の表示倍率。 |
| `docStatus` | ドキュメントサイズ。 |
| `toolStatus` | 現在の操作結果、選択ツール、対象レイヤー、警告などの状態メッセージ。 |

`updateStatus()` は倍率とドキュメントサイズを毎回同期し、引数があればそれを状態メッセージとして表示する。引数がない場合は、現在のツールまたは Free Transform 状態とアクティブレイヤー名を表示する。

## 右ドック

右ドックは編集補助と詳細設定をまとめたパネル群である。View メニューの Toggle Panels または `Shift+Tab` で表示を切り替えられる。画面幅が狭い場合は CSS により非表示になる。

### Navigator パネル

Navigator は合成結果の縮小プレビューと表示範囲を示す。プレビュー内をドラッグすると、その位置を中心にキャンバス表示を移動できる。`-`、スライダー、`+` はズーム倍率を変更する。倍率表示は `navigatorZoom` に反映される。

### Histogram パネル

Histogram は合成結果の輝度または RGB 分布を Canvas に描画する。RGB チャンネル表示の状態に応じて `histogramStatus` が更新される。編集結果の明暗傾向を確認するための読み取り専用パネルである。

### Info パネル

Info はポインター位置の情報を表示する。X/Y 座標、R/G/B、HEX、色スウォッチを表示する。キャンバス外に出た場合は `--` に戻る。

### Color パネル

Color は前景色と背景色を編集する。

- FG: ブラシ、塗りつぶし、図形、文字などで使う前景色。
- BG: 背景色、グラデーション終点、背景塗りつぶしで使う色。
- Swap: 前景色と背景色を入れ替える。
- Default: 前景色と背景色を既定値へ戻す。
- Swatches: 事前定義された色を前景色へ設定する。

ツールバー下部の色チップと同期される。

### Channels パネル

Channels は RGB 表示チャンネルと保存済みアルファチャンネルを扱う。

- Red / Green / Blue: プレビューに表示する色チャンネルを切り替える。
- Save Sel: 現在の選択範囲をアルファチャンネルとして保存する。
- Load Alpha: 保存済みアルファチャンネルを選択範囲として読み込む。
- alphaChannelList: 保存済みチャンネルの一覧、読み込み、削除を表示する。

RGB チャンネルをすべて外すことはできず、少なくとも 1 チャンネルが見える状態を維持する。

### Brush Presets パネル

Brush Presets はブラシ形状と描画特性を設定する。

| UI | 機能 |
| --- | --- |
| Hard | 硬い円形ブラシ。 |
| Soft | 柔らかい円形ブラシ。 |
| Air | エアブラシ風の低密度ブラシ。 |
| Square | 四角形ブラシ。 |
| Ink | 角度のあるカリグラフィ風ブラシ。 |
| Hardness | ブラシ端の硬さを指定する。 |
| Spacing | スタンプ間隔を指定する。 |
| Flow | 1 回の描画で乗る量を指定する。 |

プリセットを選んだあとに硬さなどを直接変えると、プリセット表示はカスタム状態になる。

### Properties パネル

Properties は現在の補正値を編集する。

- Brightness: 明るさ
- Contrast: コントラスト
- Saturation: 彩度
- Hue: 色相
- Gray: グレースケール量
- Blur: 表示ぼかし
- Adj: 調整レイヤー作成
- Reset: 現在の補正値をリセット

アクティブレイヤーが調整レイヤーの場合は、その調整レイヤーの値として扱われる。通常レイヤーの場合はグローバルな表示補正値として扱われる。

### Filters パネル

Filters は Filter メニューの主要フィルターをボタン化したパネルである。Blur、Box、Avg、Surface、Smart、Radial、Twirl、Pinch、Ripple、Sphere、ZigZag、Wave、Polar、Shear、Motion、Sharp、Unsharp、SSharp、High、Edges、Oil、Glow、Emboss、Diffuse、Wind、Contour、Extrude、Tiles、Solar、Clouds、Diff C、Flare、Fibers、Light、Noise、Reduce、Despk、Dust、Median、Half、Crystal、Points、Frag、Facet、Mezzo、Mosaic、Offset、Max、Min を実行できる。

調整レイヤー、ロックされたピクセル、編集できない対象ではボタンが無効化される。

### Transform パネル

Transform は変形と整列のショートカットである。

| UI | 機能 |
| --- | --- |
| Free | 自由変形モードを開始する。 |
| Rotate L / Rotate R | アクティブレイヤーを左または右に 90 度回転する。 |
| Flip X / Flip Y | アクティブレイヤーを左右または上下反転する。 |
| Align L / X / R | 左端、水平中央、右端を選択範囲またはキャンバスへ整列する。 |
| Align T / Y / B | 上端、垂直中央、下端を選択範囲またはキャンバスへ整列する。 |

調整レイヤーや位置ロック中のレイヤーでは、整列など位置変更系の操作が無効になる。

### Layer Style パネル

Layer Style はアクティブレイヤーの見た目の効果を編集する。

- Drop Shadow: 影の有効化、距離、サイズ、色を設定する。
- Stroke: 境界線の有効化、太さ、色を設定する。
- Outer Glow: 外側光彩の有効化、サイズ、色を設定する。
- Raster: 現在のレイヤースタイルをピクセルへ焼き込む。
- styleStatus: 有効なスタイル数、または利用不可状態を表示する。

調整レイヤーでは利用できない。マスク、クリッピング、ロック状態などによってラスタライズが無効になる場合がある。

### Layers パネル

Layers はレイヤー管理の中心パネルである。

上部アクション:

| UI | 機能 |
| --- | --- |
| New | 新規レイヤーを追加する。 |
| Dup | アクティブレイヤーを複製する。 |
| Up / Down | レイヤー順を上下へ移動する。 |
| Clip | クリッピングマスクを切り替える。 |
| Del | アクティブレイヤーを削除する。 |

レイヤー設定:

| UI | 機能 |
| --- | --- |
| Blend | Canvas の合成モードを選択する。 |
| Opacity | レイヤー全体の不透明度を指定する。 |
| Fill | レイヤースタイル以外の塗り不透明度を指定する。 |
| Blend If | 暗部または明部を透明化するしきい値を指定する。 |
| Target | ピクセル編集とマスク編集を切り替える。 |
| Lock | 透明ピクセル、ピクセル、位置、全体ロックを切り替える。 |

レイヤー一覧では、表示アイコン、レイヤーサムネイル、マスクサムネイル、レイヤー名、メタ情報を表示する。クリックでアクティブレイヤーを変更し、表示ボタンで表示・非表示を切り替える。マスクサムネイルをクリックするとマスク編集に切り替わる。レイヤー名のダブルクリックでリネームできる。

下部の Merge Visible は表示レイヤーを結合する。

### Mask パネル

Mask はアクティブレイヤーのマスク操作を提供する。

| UI | 機能 |
| --- | --- |
| Reveal | すべて表示のレイヤーマスクを追加する。 |
| Hide | すべて非表示のレイヤーマスクを追加する。 |
| Disable / Enable | マスクの無効化と再有効化を切り替える。 |
| Apply | マスクをピクセルへ適用する。 |
| Invert | マスクを反転する。 |
| Delete | マスクを削除する。 |

`maskStatus` は、マスクなし、利用可能、編集中、無効化中などの状態を表示する。

### Selection パネル

Selection は選択範囲に対する操作をまとめる。

| UI | 機能 |
| --- | --- |
| Select All | 全体を選択する。 |
| Deselect / Reselect | 選択解除、再選択を行う。 |
| Invert | 選択範囲を反転する。 |
| Quick Mask | クイックマスクモードを切り替える。 |
| Subject | 被写体相当の不透明領域を選択する。 |
| Color Range | 色域選択を行う。 |
| Similar / Grow | 類似色選択、選択範囲拡張を行う。 |
| Smooth / Expand / Contract / Border | 選択範囲を加工する。 |
| Fill FG / Fill BG | 前景色または背景色で塗りつぶす。 |
| Content | コンテンツに応じた塗りつぶしを行う。 |
| Delete / Cut / Copy Merged | 選択ピクセルの削除、カット、結合結果コピーを行う。 |
| Feather | 選択範囲のぼかし量を指定する。 |

選択範囲が必要なボタンは、選択範囲がないと無効になる。

### Paths パネル

Paths は Pen ツールで作成した作業パスを扱う。

- Make Sel: パスを選択範囲へ変換する。3 点以上で有効。
- Stroke: 現在のブラシ設定でパスを描画する。2 点以上で有効。
- Clear: 作業パスを削除する。
- pathStatus: パスなし、アンカー数などを表示する。

### History パネル

History は通常履歴と履歴スナップショットを表示する。

- Snap: 現在の状態をサムネイル付きスナップショットとして保存する。
- historySnapshotList: スナップショットの復元、History Brush のソース指定、削除を行う。
- historyList: 編集履歴の各状態を表示し、クリックでその状態へ復元する。

Undo/Redo の有効状態は現在の履歴インデックスで決まり、履歴がない方向のボタンは無効になる。

## 表示切り替えとレスポンシブ挙動

`Tab` または View メニューの Toggle Tools and Panels で、メニューバー、オプションバー、左ツールバー、右ドックをまとめて隠す。`Shift+Tab` または Toggle Panels では右ドックだけを隠す。

CSS では、画面幅が狭い場合に右ドックとメニューリストを非表示にする。これにより中央キャンバスと左ツールバーを優先表示する。

## 確認観点

バー別の機能確認は次の観点で行う。

1. メニューバーの各 `data-command` がクリックで実行される。
2. オプションバーの値を変更すると `state` と表示値が同期される。
3. 左ツールバーの選択でアクティブ表示、ツール名、ショートカット表示が変わる。
4. キャンバス操作後にステータスバーの倍率、サイズ、状態メッセージが更新される。
5. 右ドックの各パネルで、対象がない操作は無効化され、対象ができると有効化される。
6. `Tab`、`Shift+Tab`、画面幅変更でバーとパネルの表示切り替えが意図通りに動く。
